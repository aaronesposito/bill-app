import React, {useState, useEffect} from 'react'
import ReactModal from 'react-modal'
import { useGetAllBillQuery, useDeleteBillMutation, useUpdateBillMutation } from '../app/BillSlice'
import CreateBill from '../Components/CreateBill'
import UpdateBill from '../Components/UpdateBill'


function AllBills() {

    const {data:bills, isLoading, refetch} = useGetAllBillQuery()
    const [deleteBill, deleteBillResponse] = useDeleteBillMutation()
    const [targetBill, setTargetBill] = useState('')
    const [confirmation, setConfirmation] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [billsUpdated, setBillsUpdate] = useState(false)
    const [billsTotal, setBillsTotal] = useState(0)
    const [banksTotal, setBanksTotal] = useState({})
    const [balances, setBalances] = useState({})
    const [createBill, setCreateBill] = useState(false)
    const [updateBill, setUpdateBill] = useState(false)
    const [billUpdateTarget, setBillUpdateTarget] = useState(0)

    const billTotal = ()=> {
        const total = (bills.data?? [] ).reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
        setBillsTotal(total)
    } 

    const billTotalByBank = () => {
        const totalByBank = (bills.data?? [] ).reduce((banks, bill) => {
            const amt = Number(bill.amount) || 0;
            banks[bill.bank_name] = (banks[bill.bank_name] || 0) + amt;
            return banks
            }, {}
        )
        setBanksTotal(totalByBank)
    }

    const dueAndPaid=()=>{
        const totals = (bills.data?? []).reduce((duePaid, bill)=>{
            bill.paid ? duePaid.paid += bill.amount : duePaid.due += bill.amount
            return duePaid
        }, {paid:0, due:0})
        setBalances(totals)
    }   

    const handleModal=(e)=>{
        setTargetBill(e.target.value)
        setModalOpen(true)
    }

    const handleConfirmation=(e)=>{
        setConfirmation(e.target.value)
        setModalOpen(false)
    }

    const handleDelete=async()=>{
        console.log(confirmation)
        if(confirmation){
            try {
                const res = await deleteBill(targetBill).unwrap()
                console.log(res)
                if (res?.success) {
                    handleBillsUpdate()
                    setConfirmation(false)
                }
                }catch (err){
                    setErrorMessage(err?.data?.error ?? 'Login error')
                }
            }
        }
    

    const toggleBillCreate = () => {
        setCreateBill(createBill?false:true)
    }

    const toggleBillUpdate = (e) => {
        setUpdateBill(updateBill?false:true)
        setBillUpdateTarget(e.target.value)
    }

    const handleUpdateBill=()=>{
        setUpdateBill(false)
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
        if (bills) {
        billTotal()
        billTotalByBank()
        dueAndPaid()
        }
    }, [bills])

    return (
        <>
            {bills !== undefined ?(
            <>
            <table>
                <thead>
                    <tr>
                        <th>Bill</th>
                        <th>Bank</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {(bills.data).map((bill)=>{
                        return (
                            <tr key={bill.id}>
                                <td>{bill.bill_name}</td>
                                <td>{bill.bank_name}</td>
                                <td>{bill.amount}</td>
                                <td>{bill.paid?"Paid":"Unpaid"}</td>
                                <td><button value={bill.id} type='button' onClick={toggleBillUpdate}>^</button></td>
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