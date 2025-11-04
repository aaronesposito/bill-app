import React, {useState, useEffect} from 'react'
import ReactModal from 'react-modal'
import { useGetAllBillQuery, useDeleteBillMutation, useUpdateBillMutation } from '../app/BillSlice'
import { useGetAllBankQuery } from '../app/BankSlice'
import CreateBill from '../Components/CreateBill'
import UpdateBill from '../Components/UpdateBill'


function AllBills() {

    const {data:bills, isLoading:billsIsLoading, refetch} = useGetAllBillQuery()
    const {data:banks, isLoading:banksIsLoading} = useGetAllBankQuery()
    const [filteredBills, setFilteredBills] = useState([])
    const [filter, setFilter] = useState("all")
    const [sort, setSort] = useState("bill_name")
    const [deleteBill, deleteBillResponse] = useDeleteBillMutation()
    const [update, updateResponse] = useUpdateBillMutation()
    const [targetBill, setTargetBill] = useState('')
    const [confirmation, setConfirmation] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [billsTotal, setBillsTotal] = useState(0)
    const [banksTotal, setBanksTotal] = useState({})
    const [balances, setBalances] = useState({})
    const [createBill, setCreateBill] = useState(false)
    const [updateBill, setUpdateBill] = useState(false)
    const [billUpdateTarget, setBillUpdateTarget] = useState(0)
    const [errorMEssage, setErrorMessage] = useState('')

    const billTotal = (billArr)=> {
        const total = (billArr?? [] ).reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
        setBillsTotal(total)
    } 

    const billTotalByBank = (billArr) => {
        const totalByBank = (billArr?? [] ).reduce((banks, bill) => {
            const amt = Number(bill.amount) || 0;
            banks[bill.bank_name] = (banks[bill.bank_name] || 0) + amt;
            return banks
            }, {}
        )
        setBanksTotal(totalByBank)
    }

    const dueAndPaid=(billArr)=>{
        const totals = (billArr?? []).reduce((duePaid, bill)=>{
            bill.paid ? duePaid.paid += bill.amount : duePaid.due += bill.amount
            return duePaid
        }, {paid:0, due:0})
        setBalances(totals)
    }   
    
    const togglePaid=async(bill)=>{
        try{
            const res = await update({id:bill.id, data:{paid:!Boolean(bill.paid)}}).unwrap()
            if (res?.success) {
                handleBillsUpdate()
            }
        }catch (err){
                setErrorMessage(err?.data?.error ?? 'Update Error')
        }
    }
    

    const toggleBillCreate = () => {
        setCreateBill(createBill?false:true)
    }

    const showBillUpdate = (e) => {
            setUpdateBill(true)
            setBillUpdateTarget(e.target.value)
    }

    const compareBy = (key) => (a, b) => {
        const av = a?.[key];
        const bv = b?.[key];

        // null/undefined last
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;

        // numbers
        if (typeof av === "number" && typeof bv === "number") return -(av - bv);

        // booleans (true first; flip for false first)
        if (typeof av === "boolean" && typeof bv === "boolean") return av === bv ? 0 : av ? -1 : 1;

        // strings (case-insensitive, numeric-aware)
        return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
    };

    const updateFilter=()=>{
        if(bills){
            if (filter==='all'){
                    setFilteredBills([...bills.data])
                    billTotal(bills.data)
                    billTotalByBank(bills.data)
                    dueAndPaid(bills.data)
                    setFilteredBills(bills.data)
                }else{
                    const newFilteredBills = ([...bills.data].filter(bill=>bill.bank_name === filter))
                    billTotal(newFilteredBills)
                    billTotalByBank(newFilteredBills)
                    dueAndPaid(newFilteredBills)
                    setFilteredBills(newFilteredBills)
                }
        }
    }

    const handleFilterChange=(e)=>{
        setFilter(e.target.value)
        updateFilter()
    }

    const handleSortChange=(e)=>{
        setSort(e.target.value)
    }

    const handleDelete=async()=>{
        if(confirmation){
            try {
                const res = await deleteBill(targetBill).unwrap()
                if (res?.success) {
                    handleBillsUpdate()
                    setConfirmation(false)
                }
                }catch (err){
                    setErrorMessage(err?.data?.error ?? 'Login error')
            }
        }
    }
    


    const handleModal=(e)=>{
        setTargetBill(e.target.value)
        setModalOpen(true)
    }

    const handleConfirmation=(e)=>{
        setConfirmation(e.target.value)
        setModalOpen(false)
    }

    const handleUpdateBill=()=>{
        setUpdateBill(false)
        setBillUpdateTarget(0)
        handleBillsUpdate()
    }

    const handleNewBill=()=>{
        setCreateBill(false)
        handleBillsUpdate()
    }

    const handleBillsUpdate=async()=>{
        await refetch()
    }

    useEffect(()=>{
        if (confirmation) {
            handleDelete()
        }
    }, [confirmation])

    useEffect(()=>{
        
    }, [filter, bills])

    useEffect(()=>{
        if (bills) {
            updateFilter()  
        }
    }, [bills, filter])

    if (billsIsLoading || banksIsLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {bills !== undefined ?(
            <>
            <label>
                Sort By:
                <select name="sort" onChange={handleSortChange}>
                    <option value='bill_name'>Name</option>
                    <option value='bank_name'>Bank</option>
                    <option value='amount'>Amount</option>
                    <option value='paid'>Paid</option>
                </select>
            </label>
            <label>
                Filter By Bank:
                <select name="filter" onChange={handleFilterChange}>
                    <option value='all'>No</option>
                    {banks.data.map((bank)=>{
                        return(
                        <option key={bank.id} value={bank.bank_name}>{bank.bank_name}</option>
                        )
                    })}
                </select>
            </label>
            <table>
                <thead>
                    <tr>
                        <th>Bill</th>
                        <th>Bank</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Toggle Paid</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {([...(filteredBills ?? [])].sort(compareBy(sort))).map((bill)=>{
                        return (
                            <tr key={bill.id}>
                                <td>{bill.bill_name}</td>
                                <td>{bill.bank_name}</td>
                                <td>{bill.amount}</td>
                                <td>{bill.paid?"Paid":"Unpaid"}</td>
                                <td><button type='button' onClick={()=>togglePaid(bill)}>O</button></td>
                                <td><button value={bill.id} type='button' onClick={showBillUpdate}>^</button></td>
                                <td><button value={bill.id} type='button' onClick={handleModal}>X</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div>
                Total: {billsTotal}
            </div>
            <div>
                Totals by bank:
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Bank</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(banksTotal).map(([key, value])=>{
                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div>
                Totals Paid and Unpaid:
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(balances).map(([key, value])=>{
                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {!updateBill?(
                <div>
                    <button type='button' onClick={toggleBillCreate}>Create A New Bill</button>
                    {createBill?<CreateBill submitCallback={handleNewBill} />:<></>}
                </div>
            ):(<></>)}
            {!createBill && updateBill?(
                <div>
                    <UpdateBill 
                    submitCallback={handleUpdateBill}
                    billID={billUpdateTarget} />
                </div>
            ):(<></>)}
            
                </>
            ):(
                <></>
            )}
            <ReactModal 
                isOpen={modalOpen}
                preventScroll={true}
                shouldCloseOnEsc={false}
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
                contentLabel="Delete Confirmation"
            >
                <p>Are you sure?</p>
                <button value={true} type='button' onClick={handleConfirmation}>CONFIRM</button>
                <button value={false} type='button' onClick={handleConfirmation}>CANCEL</button>
            </ReactModal>
        </>
    )
}

export default AllBills