import {useState, useEffect} from 'react'
import { useUpdateBillMutation } from '../app/BillSlice'
import { useGetAllBankQuery } from '../app/BankSlice'
import { useGetOneBillQuery } from '../app/BillSlice'
import styles from '../styles/Form.module.css'

function UpdateBill({submitCallback, billID}){

    const [billData, setBillData] = useState({bill_name:"", bank_id:0, amount:0.00, due_date:0})
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
            setBillData({bill_name:"", bank_id:0, amount:0.00, due_date:0})
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
                due_date: bill.data.due_date || 0
            })}
    }, [bill])
    
    if (billLoading || banksLoading) {
        return <div>Loading...</div>
    }

    if (billError || banksError) {
        return <div>Error</div>
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
                onChange={handleChange}
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
                <select name="bank_id" id={styles.selectedBank} className={styles.formDropdown} onChange={handleChange}>
                    <option value='0'>Unchanged</option>
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
                onChange={handleChange}
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
                onChange={handleChange}
                required
                />
                </label>
                </div>
                <br/>
                <div className={styles.buttonContainer}>
                <button id={styles.submitButton} className="good-button" type='submit'>Update</button>
                <button id={styles.cancelButton} className="bad-button" type='button' onClick={submitCallback}>Cancel</button>
                </div>
            </form>
            {errorMessage?(<div>{errorMessage}</div>):(<></>)}
        </div>
    )
}

export default UpdateBill