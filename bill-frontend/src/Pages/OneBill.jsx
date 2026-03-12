import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOneBillQuery, useDeleteBillMutation } from "../app/BillSlice";
import { useGetOneBankQuery } from "../app/BankSlice";
import UpdateBill from "../Components/UpdateBill";
import { useNavigate } from "react-router-dom";
import styles from '../styles/Bill.module.css'
import ReactModal from "react-modal";
import modal from '../styles/bills.module.css'


function OneBill(){

    const params = useParams()
    const {data: bill, isLoading:billIsLoading, isError:billIsError, refetch} = useGetOneBillQuery(params.id)
    const {data: bank, isLoading:bankIsLoading, isError:bankIsError} = useGetOneBankQuery(bill?.data.bank_id, {skip:!bill})
    const [deleteBill, deleteBillResponse] = useDeleteBillMutation()
    const [modalOpen, setModalOpen] = useState(false)
    const [update, setUpdate] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    
    const toggleUpdate=()=>{
        setUpdate(!update)
    }

    const handleUpdateSubmit=async()=>{
        setUpdate(false)
        await refetch()
    }

    const handleDelete=async()=>{
        handleConfirmation()
        try {
            const res = await deleteBill(bill.data.id).unwrap()
            if (res.success) {
                navigate('/bills')
            }
            }catch (err){
                setErrorMessage(err?.data?.error ?? 'Error deleting bill')
        }
    }

    const handleModal=()=>{
        setModalOpen(true)
    }

    const handleConfirmation=(e)=>{
        setModalOpen(false)
    }

    const handleNavigate=()=>{
        navigate("/bills")
    }


    useEffect(()=>{

        }, [bill, bank])

    if (billIsLoading || bankIsLoading) {
        return (<div>Loading...</div>)
    }
    if (billIsError || bankIsError) {
        return (<div>Error...</div>)
    }

    return (
        <div className={styles.billOuter}>
            <div className={styles.billContainer}>
                <div className={styles.billContainerRow}>
                    <div className={styles.billContainerTitle}>Name</div>
                    <div className={styles.billData}>{bill.data.bill_name}</div>
                </div>
                <div className={styles.billContainerRow}> 
                    <div className={styles.billContainerTitle}>Bank</div>
                    <div className={styles.billData}>{bank.data.bank_name}</div>
                </div>
                <div className={styles.billContainerRow}>
                    <div className={styles.billContainerTitle}>Amount</div>
                    <div className={styles.billData}>{bill.data.amount}</div>
                </div>
                <div className={styles.billContainerRow}>
                    <div className={styles.billContainerTitle}>Due</div>
                    <div className={styles.billData}>{bill.data.due_date}</div>
                </div>
                <div className={styles.billContainerRow}>
                    <div className={styles.billContainerTitle}>Status</div>
                    <div className={styles.billData}>{bill.data.paid?"Paid":"Unpaid"}</div>
                </div>
            </div>
            <div className={styles.updateButtonsContainer}>
            <button type="button" className='good-button' onClick={toggleUpdate}>Update</button>
            <button type="button" className='bad-button' onClick={handleModal}>Delete</button>
            <button type="button" className='good-button' onClick={handleNavigate}>Back</button>
            </div>
            <div className={styles.updateFormContainer}>
            {update ? (<UpdateBill submitCallback={handleUpdateSubmit}
                        billID={bill.data.id}
                />):(<></>)}
            </div>
                        <ReactModal 
                            isOpen={modalOpen}
                            preventScroll={true}
                            shouldCloseOnEsc={false}
                            shouldCloseOnOverlayClick={false}
                            ariaHideApp={false}
                            contentLabel="Delete Confirmation" 
                            overlayClassName={modal.modalOverlay}
                            className={modal.modalStyle}
                        >
            
                            <p>Are you sure?</p>
                            <div className={modal.modalButtons}>
                                <button value={true} id={modal.confirm} className='good-button' type='button' onClick={handleDelete}>CONFIRM</button>
                                <button value={false}id={modal.cancel} className='bad-button' type='button' onClick={handleConfirmation}>CANCEL</button>
                            </div>
            
                        </ReactModal>
        </div>
    )
}

export default OneBill;