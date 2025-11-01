import {useState, useEffect} from 'react'


function AllBills() {

    const [bills, setBills] = useState([])
    const [billsTotal, setBillsTotal] = useState(0)
    const {banksTotal, setBanksTotal} = useState({})

    const getBills = async ()=>{
        await fetch('http://localhost:8081/bill/all', {
            method: "GET",
            headers: {'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials: 'include'
        })
        .then(async response=>{
            const billResponse = await response.json()
            setBills(billResponse.data)
        })
    }

    const billTotal = ()=> {
        const total = (bills?? [] ).reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
        setBillsTotal(total)
    } 

    const billTotalByBank = () => {
        const totalByBank = (bills?? [] ).reduce((banks, bill) => {
            const amt = Number(bill.amount) || 0;
            acc[bill.bank_id] = (banks[b.bank_id] || 0) + amt;
            }, {}
        )
        setBanksTotal(totalByBank)
    }

    useEffect(()=>{
        getBills()
    },[])

    useEffect(()=>{
        billTotal()
    }, [bills])

    return (
        <>
            {bills?(
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
                    {bills.map((bill)=>{
                        return (
                            <tr key={bill.id}>
                                <td>{bill.bill_name}</td>
                                <td>{bill.bank_id}</td>
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
            <table>
                <thead>
                    <tr>
                        <th>Bank</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {banksTotal.map((bank)=>{
                        return (
                            <tr key={bank.bank_id}>
                                <td>{bank.bank_id}</td>
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