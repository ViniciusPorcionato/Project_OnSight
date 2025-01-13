export const Container = (props) => {
    return(
        <div className={`w-[90%] flex ${props.additionalClasses}`}>{props.children}</div>
    )
}

export const FormContainer = ({ children }) => {
    return (
      <div className="w-[786px] h-[850px] bg-white rounded-[15px] shadow-lg p-8">
        {children}
      </div>
    );
  };