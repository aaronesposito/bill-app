import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOneBillQuery } from "../app/BillSlice";
import { useGetOneBankQuery } from "../app/BankSlice";
import UpdateBill from "../Components/UpdateBill";
import { useNavigate } from "react-router-dom";
import styles from '../styles/Bill.module.css'


function OneBill(){

    const params = useParams()
    const {data: bill, isLoading:billIsLoading, isError:billIsError, refetch} = useGetOneBillQuery(params.id)
    const {data: bank, isLoading:bankIsLoading, isError:bankIsError} = useGetOneBankQuery(bill?.data.bank_id, {skip:!bill})
    const [update, setUpdate] = useState(false)
    const navigate = useNavigate()
    
    const toggleUpdate=()=>{
        setUpdate(!update)
    }

    const handleUpdateSubmit=async()=>{
        setUpdate(false)
        await refetch()
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
                    <div className={styles.billContainerTitle}>ID</div>
                    <div>{bill.data.id}</div>
                </div>
                <div className={styles.billContainerRow}>
                    <div className={styles.billContainerTitle}>Name</div>
                    <div>{bill.data.bill_name}</div>
                </div>
                <div className={styles.billContainerRow}> 
                    <div className={styles.billContainerTitle}>Bank</div>
                    <div>{bank.data.bank_name}</div>
                </div>
                <div className={styles.billContainerRow}>
                    <div className={styles.billContainerTitle}>Amount</div>
                    <div>{bill.data.amount}</div>
                </div>
                <div className={styles.billContainerRow}>
                    <div className={styles.billContainerTitle}>Status</div>
                    <div>{bill.data.paid?"Paid":"Unpaid"}</div>
                </div>
            </div>
            <button type="button" onClick={toggleUpdate}>Update</button>
            {update ? (<UpdateBill submitCallback={handleUpdateSubmit}
                        billID={bill.data.id}
                />):(<></>)}
            <button type="button" onClick={handleNavigate}>Back</button>
        </div>
    )
}

export default OneBill;