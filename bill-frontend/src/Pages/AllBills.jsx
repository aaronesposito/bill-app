import {useState, useEffect} from 'react'
import { useGetAllBillQuery } from '../app/BillSlice'


function AllBills() {

    const {data:bills, isLoading} = useGetAllBillQuery()
    const [billsTotal, setBillsTotal] = useState(0)
    const [banksTotal, setBanksTotal] = useState({})
    const [balances, setBalances] = useState({})

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

    const dueAndPaid = () => {
        const totals = (bills.data?? []).reduce((duePaid, bill)=>{
            bill.paid ? duePaid.paid += bill.amount : duePaid.due += bill.amount
            return duePaid
        }, {paid:0, due:0})
        setBalances(totals)
    }

    const dataLoaded=()=>{
        return bills !== undefined
    }

    useEffect(()=>{
        if (bills) {
        billTotal()
        billTotalByBank()
        dueAndPaid()
        console.log(bills.data)
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
                </>
            ):(
                <></>
            )}
        </>
    )
}

export default AllBills