import {useState, useEffect} from 'react'
import { useUpdateBillMutation } from '../app/BillSlice'
import { useGetAllBankQuery } from '../app/BankSlice'
import { useGetOneBillQuery } from '../app/BillSlice'

function UpdateBill({submitCallback, billID}){

    const [billData, setBillData] = useState({bill_name:"", bank_id:0, amount:0.00})
    const {data:bill, isLoading: billLoading, isError: billError} = useGetOneBillQuery(billID)
    const {data:banks, isLoading: banksLoading, isError: banksError} = useGetAllBankQuery()
    const [update, updateResponse, isError, error] = useUpdateBillMutation()
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBillData((prev) => ({
        ...prev,
        [name]: name === "amount" || name === "bank_id" ? Number(value) : value,
        }));
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const res = await update({id:billID, data: billData}).unwrap()
            setBillData({bill_name:"", bank_id:0, amount:0.00})
            submitCallback()
        }catch{
            setErrorMessage(err?.data?.error ?? 'Error updating Bill')
        }
    }

    useEffect(()=>{
        if (bill) {
            setBillData({
                bill_name: bill.data.bill_name ?? "",
                bank_id: bill.data.bank_id ?? 0,
                amount: Number(bill.data.amount) || 0,
            })}
    }, [bill])
    
    if (billLoading || banksLoading) {
        return <div>Loading...</div>
    }

    if (billError || banksError) {
        return <div>Error</div>
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Bill Name
                    <input
                        type="text"
                        name="bill_name"
                        value={billData.bill_name}
                        onChange={handleChange}
                        required
                     />
                </label>
                <br/>
                <label>
                    Bank
                    <select name="bank_id" onChange={handleChange}>
                        <option value='0'></option>
                        {banks.data.map((bank)=>{
                            return (
                                <option key={bank.id} value={bank.id}>{bank.bank_name}</option>
                            )
                        })}
                    </select>
                </label>
                <br/>
                <label>
                    Amount
                    <input
                        type="number"
                        name="amount"
                        value={billData.amount}
                        onChange={handleChange}
                        required
                     />
                </label>
                <br/>
                <button type="submit">Update</button>
            </form>
            <button type="button" onClick={submitCallback}>Cancel</button>
        </>
    )
}

export default UpdateBill