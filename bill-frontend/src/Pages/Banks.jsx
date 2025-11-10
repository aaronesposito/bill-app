import {useState, useEffect} from 'react'
import ReactModal from 'react-modal'
import { useGetAllBankQuery, useCreateBankMutation, useDeleteBankMutation } from '../app/BankSlice'
import { useGetAllBillQuery } from '../app/BillSlice'
import modal from '../styles/Bills.module.css'
import styles from '../styles/Banks.module.css'
import form from '../styles/Form.module.css'


function Banks(){

    const {data:bills, isLoading:billsIsLoading, isError:billsIsError} = useGetAllBillQuery()
    const {data:banks, isLoading:banksIsLoading, isError:banksIsError, refetch} = useGetAllBankQuery()
    const [createBank, createBankResponse ] = useCreateBankMutation()
    const [deleteBank, deleteBankResponse ] = useDeleteBankMutation()
    const [errorMessage, setErrorMessage] = useState("")
    const [bankData, setBankData] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [targetBank, setTargetBank] = useState({id:0, bank_name:""})
    const [hasBills, setHasBills] = useState(false)


    

    const handleChange=(e)=>{
        setBankData(e.target.value)
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const res = await createBank({bank_name:bankData}).unwrap()
            if (res?.success) {
                setBankData("")
                refetch()
            }
        }catch(err){
            setErrorMessage(err?.data?.error ?? 'Error Creating Bank')
        }
    }

    const checkEmpty=(bankToCheck)=>{
        if (bills && bankToCheck){
            for (let i = 0; i < bills.data.length; i++) {
                let billValues = Object.values([...bills.data][i])
                if (billValues.includes(bankToCheck)) {
                    setHasBills(true)
                    break
                }
            }
        }
    }

    const handleModalOpen=(e)=>{
        setTargetBank({id:e.target.value, bank_name:e.target.dataset.bankName})
        setModalOpen(true)
    }

    const handleModalClose=()=>{
        setTargetBank({id:0, bank_name:""})
        setModalOpen(false)
        setHasBills(false)
    }

    const handleConfirmation=()=>{
        setModalOpen(false)
        handleDelete()
    }

    const handleDelete=async()=>{
        try{
            const res = await deleteBank(targetBank.id).unwrap()
            if (res?.success) {
                await refetch()
                setTargetBank({id:0, bank_name:""})
            }
        }catch(err){
            setErrorMessage(err?.data?.error ?? 'Error Deleting Bank')
        }
    }

    useEffect(()=>{
        
    }, [banks])

    useEffect(()=>{
        checkEmpty(targetBank.bank_name)
    }, [targetBank])

        
    if (billsIsLoading || banksIsLoading) {
        return <div>Loading...</div>
    }

    if (billsIsError || banksIsError) {
        return <div>Error</div>
    }

    return (
    <>
    <div className={styles.banksContainer}>
            <form id={form.banksFormContainer} onSubmit={handleSubmit}>
                <label id={form.banksFormLabel}className={form.formInputLabel}>
                    <div id={form.banksFormTag} className={form.formTag}>
                    New Bank: 
                    </div>
                </label>
                    <input
                        id={form.banksFormInput}
                        className={form.input}
                        type='text' 
                        name='bank_name'
                        value={bankData}
                        onChange={handleChange}
                        required
                    />

                <button type='submit' className='good-button'>Add Bank</button>
            </form>
        <div className={styles.bankListWithHeader}>
        <div style={{fontSize:25 + 'px', paddingBottom:15 + 'px'}}>Available Banks:</div>
        <div className={styles.bankList}>
            {banks.data.map((bank)=>{
                return(
                    <div key={bank.id}>
                        <div className={styles.bankRow}>
                                <div className={styles.deleteButtonContainer}>
                                    <button 
                                    id={styles.deleteButton}
                                    className="bad-button"
                                    value={bank.id}
                                    data-bank-name={bank.bank_name} 
                                    type='button'
                                    onClick={handleModalOpen}
                                    >X</button>
                                </div>
                            <div style={{paddingRight:10 + 'px'}}>{bank.bank_name}</div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>

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
                {!hasBills?(
                    <>
                    <p >Are you sure?</p>
                    <div className={modal.modalButtons}>
                        <button id={modal.confirm} value={true} className='good-button' type='button' onClick={handleConfirmation}>CONFIRM</button>
                        <button id={modal.cancel} className='bad-button' type='button' onClick={()=>setModalOpen(false)}>CANCEL</button>
                    </div>
                    </>
                ):(
                    <>
                    <p id={modal.text}>Cannot delete a bank that has associated bills</p>
                    <div className={modal.modalButtons}>
                    <button id={modal.cancel} className='bad-button' type='button' onClick={handleModalClose}>CANCEL</button>
                    </div>
                    </>
                )}
                
            </ReactModal>
            {errorMessage?(<div>{errorMessage}</div>):(<></>)}
        </>
    )
}

export default Banks