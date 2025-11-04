import {useState, useEffect} from 'react'
import ReactModal from 'react-modal'
import { useGetAllBankQuery, useCreateBankMutation, useDeleteBankMutation } from '../app/BankSlice'
import AllBills from './AllBills'


function Banks(){

    const {data:banks, isLoading, isError, refetch } = useGetAllBankQuery()
    const [createBank, createBankResponse ] = useCreateBankMutation()
    const [deleteBank, deleteBankResponse ] = useDeleteBankMutation()
    const [errorMessage, setErrorMessage] = useState("")
    const [bankData, setBankData] = useState("")
    const [confirmation, setConfirmation] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [targetBank, setTargetBank] = useState(0)


    

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

    const handleModal=(e)=>{
        setTargetBank(e.target.value)
        setModalOpen(true)
    }

    const handleConfirmation=(e)=>{
        setConfirmation(e.target.value)
        setModalOpen(false)
    }

    const handleDelete=async()=>{
        try{
            const res = await deleteBank(targetBank).unwrap()
            if (res?.success) {
                await refetch()
            }
        }catch(err){
            setErrorMessage(err?.data?.error ?? 'Error Deleting Bank')
        }
    }

    useEffect(()=>{
        
    }, [banks])

    useEffect(()=>{
        if (confirmation) {
            handleDelete()
            setConfirmation(false)
        }
    }, [confirmation])

        
    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
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
                                    type='button'
                                    onClick={handleModal}
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
                <p>Are you sure?</p>
                <button value={true} type='button' onClick={handleConfirmation}>CONFIRM</button>
                <button value={false} type='button' onClick={handleConfirmation}>CANCEL</button>
            </ReactModal>
        </>
    )
}

export default Banks