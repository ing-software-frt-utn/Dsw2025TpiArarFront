import { ReactElement, isValidElement } from "react";
import "./List.css";

interface ListProps {
  order: "Ordered" | "Unordered";
  children: ReactElement | ReactElement[];
  className?: string;
}
function List(props: ListProps) {
  const items = props.children;
  if (isValidElement(items)) {
    throw new Error("Is not a ReactElement");
  }
  if (Array.isArray(items)) {
    items.forEach((item) => {
      if (item.type !== "li") throw new Error(`${item} is not 'li'`);
    });
  } else {
    if (items.type !== "li") {
      throw new Error(`${items} is not 'li'`);
    }
  }
  if (props.order === "Ordered") {
    return <ol className={props.className}>{props.children}</ol>;
  } else if (props.order === "Unordered") {
    return <ul className={props.className}>{props.children}</ul>;
  }
}

export default List;
