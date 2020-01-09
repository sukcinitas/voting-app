import React from "react";
import PollListElem from "./PollListElem/PollListElem";

const PollList = (props) => {
    const list = props.list.map(item => {
        return  <div>
                    <PollListElem question={item.question} votes={item.votes}/>
                </div>
    })
    return (
        <div>
            {list}
        </div>
    )
}

export default PollList;