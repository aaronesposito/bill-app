import {useState, useEffect} from 'react'
import ReactModal from 'react-modal'
import { useGetAllBankQuery, useCreateBankMutation, useDeleteBankMutation } from '../app/BankSlice'
import { useGetAllBillQuery } from '../app/BillSlice'


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
            <table>
                <thead>
                    <tr>
                        <th>Available Banks</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {banks.data.map((bank)=>{
                        return(
                            <tr key={bank.id}>
                                <td>{bank.bank_name}</td>
                                <td>
                                    <button 
                                    value={bank.id}
                                    data-bank-name={bank.bank_name} 
                                    type='button'
                                    onClick={handleModalOpen}
                                    >X</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <form onSubmit={handleSubmit}>
                <label>
                    New Bank Name: 
                    <input 
                        type='text' 
                        name='bank_name'
                        value={bankData.bank_name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type='submit'>Add Bank</button>
            </form>
            <ReactModal 
                isOpen={modalOpen}
                preventScroll={true}
                shouldCloseOnEsc={false}
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
                contentLabel="Delete Confirmation"
            >
                {!hasBills?(
                    <>
                    <p>Are you sure?</p>
                    <button value={true} type='button' onClick={handleConfirmation}>CONFIRM</button>
                    <button type='button' onClick={()=>setModalOpen(false)}>CANCEL</button>
                    </>
                ):(
                    <>
                    <p>Cannot delete a bank that has associated bills</p>
                    <button type='button' onClick={handleModalClose}>CANCEL</button>
                    </>
                )}
                
            </ReactModal>
            {errorMessage?(<div>{errorMessage}</div>):(<></>)}
        </>
    )
}

export default Banks