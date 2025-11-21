import { ReactElement, isValidElement } from "react"
interface ListProps{
    children: ReactElement | ReactElement[];
}
function List(props: ListProps) {
    const items = props.children;
    if(isValidElement(items)){
        throw new Error("Is not a ReactElement");
    }
    if(Array.isArray(items)){
        items.forEach((item) => {

            if(item.type !== "li")
                throw new Error(`${item} is not \'li\'`); 

        });
    }else{
        if(items.type !== "li"){
            throw new Error(`${items} is not \'li\'`); 
        }
    }
    return (
        <ul >
            {props.children}
        </ul>
    );
    
}

export default List;