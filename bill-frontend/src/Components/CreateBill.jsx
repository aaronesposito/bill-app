import { useCreateBillMutation } from "../app/BillSlice"
import { useGetAllBankQuery } from "../app/BankSlice"
import { useState } from "react"

function CreateBill({submitCallback}){
    const [billData, setBillData] = useState({bill_name:"", bank_id:0, amount:0.00})
    const {data: banks, isLoading, isError} = useGetAllBankQuery()
    const [createBill, createBillResponse] = useCreateBillMutation()
    const [errorMessage, setErrorMessage] = useState("")

    const updateBillData = (e) => {
      const {name, value} = e.target
      setBillData(prev => ({
          ...prev,
          [name]: value
      }))
    }


    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const res = await createBill(billData).unwrap()
            if (res?.success){
                setBillData({bill_name:"", bank_id:0, amount:0.00})
                submitCallback()
            }
        }catch(err){
            setErrorMessage("Error Occurred Creating Bill")
        }
    }


    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
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
            onChange={updateBillData}
            required
            />
            </label>
            <br/>
            <label>
                Bank
            <select name="bank_id" onChange={updateBillData}>
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
            onChange={updateBillData}
            required
            />
            </label>
            <br/>
            <button type='submit'>Submit</button> 
        </form>
        <button type="button" onClick={submitCallback}>Cancel</button>
        {errorMessage?(<div>{errorMessage}</div>):(<></>)}
        </>
    )
}

export default CreateBill