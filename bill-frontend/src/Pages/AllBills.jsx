import {useState, useEffect} from 'react'


function AllBills() {

    const [bills, setBills] = useState([])

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
            console.log(billResponse.data)
            setBills(billResponse.data)
        })
    }

    useEffect(()=>{
        getBills()
    },[])


    return (
        <>
            {bills?(
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
            </table>):(
                <></>
            )}
        </>
    )
}

export default AllBills