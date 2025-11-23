import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function OneBill(){

    const {id} = useParams()

    return (
        <div>
            <div>This is the bill form furrently displaying</div>
            <div>Bill: {id} </div>
        </div>
    )
}

export default OneBill;