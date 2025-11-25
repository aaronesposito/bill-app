import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import ReactModal from 'react-modal'
import { useGetAllBillQuery, useDeleteBillMutation, useUpdateBillMutation } from '../app/BillSlice'
import { useGetAllBankQuery } from '../app/BankSlice'
import CreateBill from '../Components/CreateBill'
import UpdateBill from '../Components/UpdateBill'
import styles from '../styles/Bills.module.css'

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
    const navigate = useNavigate()
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

    const toggleAllUnpaid=async()=>{
        bills.data.map(async(bill)=>{
            try{
                const res = await update({id:bill.id, data:{paid:false}}).unwrap()
            }catch (err){
                    setErrorMessage(err?.data?.error ?? 'Update Error')
            }
        })
        handleBillsUpdate()
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
            setCreateBill(false)
            setUpdateBill(true)
            setBillUpdateTarget(e.target.value)
    }

    const renderCell = () => {
        const sorted = [...(filteredBills ?? [])].sort(compareBy(sort));
           let table = []
                sorted.map((bill) => {
                        table.push(
                            <div className={styles.tableDataRow}>
                            <a href={`/bills/${bill.id}`} className={styles.row}>{bill?.bill_name ?? ""}</a>
                            <div className={styles.row}>{bill?.bank_name ?? ""}</div>
                            <div className={styles.row}>{(bill?.amount.toFixed(2)) ?? ""}</div>
                            <div className={styles.row}>{bill.paid?"Paid":"Unpaid"}</div>
                            <div className={styles.buttonContainer}><button id={styles.toggle} className="good-button" type="button" onClick={() => togglePaid(bill)}>O</button></div>
                            <div className={styles.buttonContainer}><button id={styles.update} className="caution-button" type="button" value={bill.id} onClick={showBillUpdate}>^</button></div>
                            <div className={styles.buttonContainer}><button id={styles.delete} className="bad-button" type="button" value={bill.id} onClick={handleModal}>X</button></div>
                            </div>
                            )
                        }
                    )
        return table
    }
                    

    const compareBy = (key) => (a, b) => {
        const av = a?.[key];
        const bv = b?.[key];

        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;

        if (typeof av === "number" && typeof bv === "number") return -(av - bv);

        if (typeof av === "boolean" && typeof bv === "boolean") return av === bv ? 0 : av ? -1 : 1;

        return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
    }

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

    const handleNavigate=(e)=>{
        console.log(e.target.value)
    }

    useEffect(()=>{
        if (confirmation==='true') {
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
            <div>
                <div className={styles.tableController}>
            <label className= {styles.sort}>
                Sort By:
                <select name="sort" onChange={handleSortChange}>
                    <option value='bill_name'>Name</option>
                    <option value='bank_name'>Bank</option>
                    <option value='amount'>Amount</option>
                    <option value='paid'>Paid</option>
                </select>
            </label>
            <label className= {styles.filter}>
                Filter By Bank:
                <select name="filter" onChange={handleFilterChange}>
                    <option value='all'>No</option>
                    {banks.data.map((bank)=>{
                        return(
                        <option key={bank.id} value={bank.bank_name}>{bank.bank_name}</option>
                        )
                    })}
                </select>
                <div>
                    <button type='button' id={styles.filterButton} className="good-button" onClick={toggleAllUnpaid}>Set All Unpaid</button>
                </div>
            </label>
            </div>
                <div className={styles.controller}>
                    <div>
                    <div className={styles.tableContainer}>
                        <div className={styles.headerRow}>
                            <div className={styles.header}>Bill</div>
                            <div className={styles.header}>Bank</div>
                            <div className={styles.header}>Amount</div>
                            <div className={styles.header}>Paid</div>
                            <div className={styles.header}>Toggle</div>
                            <div className={styles.header}>Update</div>
                            <div className={styles.header}>Delete</div>
                        </div>
                        <div className={styles.tableBody}>
                            {renderCell().map((row)=>{
                                    return  row
                                })}
                        </div>
                    </div>
                    <div className={styles.dataFormContainer}>
                        <div className={styles.subdata}>
                            <div className={styles.totalContainer}>
                                <div className={styles.totalLabel}>
                                    Total: 
                                </div>
                                <div className={styles.totalAmount}>
                                    ${(billsTotal.toFixed(2))}
                                </div>
                            </div>
                            <div className={styles.smallTableContainer}>
                                <div className={styles.smallTableHeader}>
                                Totals by bank:
                                </div>
                                <div className={styles.smallTableData}>
                                    {Object.entries(banksTotal).map(([key, value])=>{
                                        return (
                                            <div className={styles.smallTableRow} key={key}>
                                                <div className={styles.smallTableValue}>{key}</div>
                                                <div className={styles.smallTableValue}>${(value.toFixed(2))}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={styles.smallTableContainer}>
                                <div className={styles.smallTableHeader}>
                                Paid and Unpaid
                                </div>
                                <div className={styles.smallTableData}>
                                    {Object.entries(balances).map(([key, value])=>{
                                        return (
                                            <div className={styles.smallTableRow} key={key}>
                                                <div className={styles.smallTableValue}>{key}</div>
                                                <div className={styles.smallTableValue}>${(value.toFixed(2))}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={styles.bottomRightContainer}>
                            {!updateBill?(
                                <div>
                                <div className={styles.newBillButton}>
                                    <button type='button' id={styles.submitButton} className='good-button' onClick={toggleBillCreate}>New Bill</button>
                                </div>
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
                        </div>
                    </div>
                </div>

            </div>
            
            
            
            </div>
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
                overlayClassName={styles.modalOverlay}
                className={styles.modalStyle}
            >

                <p>Are you sure?</p>
                <div className={styles.modalButtons}>
                    <button value={true} id={styles.confirm} className='good-button' type='button' onClick={handleConfirmation}>CONFIRM</button>
                    <button value={false}id={styles.cancel} className='bad-button' type='button' onClick={handleConfirmation}>CANCEL</button>
                </div>

            </ReactModal>
        </>
    )
}

export default AllBills