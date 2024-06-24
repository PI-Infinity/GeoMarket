import CircularProgress from "@mui/material/CircularProgress";

interface PropsType {
  title: any;
  onClick: () => void;
  background: string;
  color: string;
  disabled?: any;
  loading?: boolean;
  id?: string;
}

const Button: React.FC<PropsType> = ({
  title,
  onClick,
  background,
  color,
  disabled,
  loading,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={!loading ? onClick : undefined}
      className={`w-full h-full rounded-xl flex items-center justify-center gap-2 ${
        disabled ? "bg-gray-300" : "bg-" + background + "-500"
      } text-${disabled ? "white" : color} cursor-${
        disabled ? "default" : "pointer"
      } hover:${disabled ? "none" : "brightness-105"} font-semibold`}
    >
      {loading && <CircularProgress sx={{ color: "white" }} size={20} />}
      {title}
    </div>
  );
};

export default Button;
