import List from "../../../shared/components/List";
interface ListAuthProps<T> {
  items: T[];
  valid: (err: T) => boolean;
  msg: (err: T) => string;
}
function ListAuth<T>(props: ListAuthProps<T>) {
  return (
    <List order="Unordered">
      {props.items.map((err, index) => (
        <li
          key={index}
          className={`
          ${props.valid(err) ? "text-red-500" : "xs:hidden text-green-600"}
          p-1.5
          rounded-[2vw]
          m-1
          sm:m-0 sm:p-0
          lg:m-0 lg:p-0
          md:m-0 md:p-0
          xl:m-0 xl:p-0
          2x1:m-0 2x1:p-0 2x1:hidden
          text-center
        `}
        >
          {(props.valid(err) ? "\u2716" : "\u2714") + " - " + props.msg(err)}
        </li>
      ))}
    </List>
  );
}
export default ListAuth;
