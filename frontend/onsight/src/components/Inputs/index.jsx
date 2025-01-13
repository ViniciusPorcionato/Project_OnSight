"use client";

import React,{ useState, useEffect } from "react";
import { getAllClients } from "@/service/userManagementService";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, ImagePlus } from "lucide-react";
import { IoSearch } from "react-icons/io5";

export const InputLogin = ({
  type,
  placeholder,
  value,
  onChange,
  additionalClasses,
  onKeyDown,
}) => {
  return (
    <div className="w-full flex justify-center">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`w-full max-w-[400px] h-auto mt-2 p-2 rounded-lg border border-[#142937] ${additionalClasses}`}
        required
      />
    </div>
  );
};

export const InputPassword = ({
  placeholder,
  value,
  onChange,
  width,
  additionalClasses,
  onKeyDown
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="w-[100%] flex justify-center items-center">
      <div className="relative w-full max-w-[400px] flex items-center justify-center">
        <input
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          width={width}
          onKeyDown={onKeyDown}
          className={`w-[100%] h-auto mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262] ${additionalClasses}`}
          required
        />
        <button
          className="flex mt-1 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#142937]"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
};

export const InputFormComplement = ({
  type,
  placeholder,
  value,
  onChange,
  width,
  name,
  additionalClasses,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`w-auto h-auto mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262] ${additionalClasses}`}
    />
  );
};
export const InputForm = ({
  type,
  placeholder,
  value,
  onChange,
  width,
  name,
  additionalClasses,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`w-auto h-auto mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262] ${additionalClasses}`}
      required
    />
  );
};

export const InputFormPassword = ({
  placeholder,
  value,
  onChange,
  width,
  name,
  additionalClasses,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      <input
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        width={width}
        name={name}
        className={`w-[100%] h-auto mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262] ${additionalClasses}`}
        required
      />
      <button
        className="flex mt-1 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#142937]"
        type="button"
        onClick={toggleVisibility}
      >
        {isVisible ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
};

export const InputSelectImage = (props) => {
  return (
    <div>
      <input
        className="hidden"
        id="image-input"
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        onChange={props.onChange}
        value={props.value}
      />

      <label
        htmlFor="image-input"
        className="flex justify-center cursor-pointer absolute p-1 bottom-[5%] right-[40%] rounded-[100%] bg-[#096CAF]"
      >
        <ImagePlus className="text-white" size={20} />
      </label>
    </div>
  );
};

export const FormInput = ({
  label,
  placeholder,
  type = "text",
  name,
  className,
}) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label className="text-[#142937] text-xl font-normal font-['Nunito'] mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full h-[61.48px] rounded-[10px] border border-[#142937] px-3 font-['Nunito'] text-base"
      />
    </div>
  );
};

export const CustomSelect = ({
  label,
  options = [],
  selectedValue,
  onChange,
  className,
}) => {
  return (
    <div className={`flex flex-col w-[468px] ${className}`}>
      <label className="text-[#142937] text-xl font-normal font-['Nunito'] mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          className="w-full h-[61.48px] rounded-[10px] border border-[#142937] text-[#142937] text-xl font-['Nunito'] px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#03558c]"
          value={selectedValue}
          onChange={onChange}
        >
          <option value="" disabled hidden>
            Selecione uma opção
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#142937]"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const InputSearch = ({ placeholder, onSearch }) => {

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query === '' ? null : query);
    }
  };

  useEffect(() => {
    if (query === '') {
      handleSearch();
    }
  }, [query])

  return (
    <div className="relative flex items-center w-[13vw] bg-[#FAFAFA] rounded-lg shadow-md p-1 pl-3 pr-3 border hover:border-[#9CA3AF]">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={e => {
          const newValue = e.target.value;

          setQuery(newValue.trim());
        }}
        className="bg-transparent outline-none text-[#142937] placeholder-[#7E888F] font-nunito overflow-hidden w-[80%]"
        onKeyDown={event => {
          if (event.key == 'Enter') {
            handleSearch();
          }
        }}
      />
      <button
        onClick={handleSearch}
        className="absolute right-2 text-[#7E888F] hover:text-gray-800 font-nunito"
        aria-label="Pesquisar"
      >
        <IoSearch />
      </button>
    </div>
  );
};

export const InputSelectClients = ({
  label,
  selectedValue,
  onChange,
  className,
}) => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fazendo a requisição dos clientes ao montar o componente
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const fetchedClients = await getAllClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Erro ao buscar todos os clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className={`flex flex-col w-[468px] ${className}`}>
      {label && (
        <label className="text-[#142937] text-xl font-normal font-['Nunito'] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {isLoading ? (
          <p>Carregando clientes...</p>
        ) : (
          <select
            className="w-full h-[61.48px] rounded-[10px] border border-[#142937] text-[#142937] text-xl font-['Nunito'] px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#03558c]"
            value={selectedValue}
            onChange={onChange}
          >
            <option value="" disabled hidden>
              Selecione um cliente
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        )}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#142937]"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
