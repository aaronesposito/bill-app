import { useCreateBillMutation } from "../app/BillSlice"
import { useGetAllBankQuery } from "../app/BankSlice"
import { useState } from "react"
import styles from "../styles/Form.module.css"

function CreateBill({submitCallback}){
    const [billData, setBillData] = useState({bill_name:"", bank_id:0, amount:"", due_date:""})
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
                setBillData({bill_name:"", bank_id:0, amount:0.00, due_date:0})
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

    if (banks.data.length==0){
        return <div>Create A Bank First</div>
    }

    return(
        <div id={styles.createFormContainer} className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <div>
                <label className={styles.formInputLabel}>
                    <div className={styles.formTag}>
                        Bill Name
                    </div>
                <input
                className={styles.formInput}
                type="text"
                name="bill_name"
                value={billData.bill_name}
                onChange={updateBillData}
                required
                />
                </label>
                </div>
                <br/>
                <div>
                <label id={styles.bankLabel} className={styles.formDropdownLabel}>
                    <div id={styles.bankTag} className={styles.formTag}>
                        Bank
                    </div>
                <select name="bank_id" id={styles.selectedBank} className={styles.formDropdown} onChange={updateBillData}>
                    <option value='0'></option>
                    {banks.data.map((bank)=>{
                        return (
                            <option  key={bank.id} value={bank.id}>{bank.bank_name}</option>
                        )
                    })}
                </select>
                </label>
                </div>
                <br/>
                <div>
                <label id={styles.amountLabel} className={styles.formInputLabel}>
                    <div  id={styles.amountTag} className={styles.formTag}>
                        Amount
                    </div>
                <input
                id={styles.billAmount}
                className={styles.formInput}
                type="number"
                name="amount"
                value={billData.amount}
                onChange={updateBillData}
                required
                />
                </label>
                <br/>
                <label id={styles.dateLabel} className={styles.formInputLabel}>
                    <div  id={styles.dateTag} className={styles.formTag}>
                        Due Date
                    </div>
                <input
                id={styles.billDate}
                className={styles.formInput}
                type="number"
                name="due_date"
                value={billData.due_date}
                onChange={updateBillData}
                required
                />
                </label>
                </div>
                <br/>
                <div className={styles.buttonContainer}>
                <button id={styles.submitButton} className="good-button" type='submit'>Submit</button>
                <button id={styles.cancelButton} className="bad-button" type='button' onClick={submitCallback}>Cancel</button>
                </div>
            </form>
            {errorMessage?(<div>{errorMessage}</div>):(<></>)}
        </div>
    )
}

export default CreateBill