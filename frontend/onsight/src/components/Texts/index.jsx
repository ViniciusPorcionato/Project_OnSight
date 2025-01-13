
export const TitleModalUser = (props) => {
    return(
        <h1 className="font-nunito-semibold text-[#124262] text-[25px]">{props.children}</h1>
    )
}

export const TitlePage = (props) => {
    return(
        <h1 className="font-nunito-bold text-[#142937] text-[22px] ">{props.children}</h1>
    )
}

export const TextButton = (props) => {
    return(
        <h1 className={`font-nunito-bold text-[#FFFFFF] ${props.additionalClasses}`}>{props.children}</h1>
    )
}
export const TextButtonDark = (props) => {
    return(
        <h1 className="font-nunito-bold text-[#124262] text-[18px]">{props.children}</h1>
    )
}

export const TextNameUserModal = (props) => {
    return(
        <h1 className="font-nunito-semibold text-[#142937] text-[18px]">{props.children}</h1>
    )
}

export const TextTypeUser = (props) => {
    return(
        <h1 className="font-nunito-semibold text-[#142937] text-[18px] hover:text-[#03558c]">{props.children}</h1>
    )
}

export const TextTable = (props) => {
    return(
        <p className="font-nunito text-[#142937] text-[16px] max-sm:text-[10px]">{props.children}</p>
    )
}

export const TextInformationUser = (props) => {
    return(
        <p className="font-nunito-bold text-[#142937] text-[14px]">{props.children}</p>
    )
}

export const TextDescriptionUser = (props) => {
    return(
        <p className="font-nunito-light text-[#142937] text-[14px]">{props.children}</p>
    )
}