type ErrorLabelProps = {
  message: string;
};

const ErrorLabel = (props: ErrorLabelProps) => {
  return (
    <div className="w-full">
      <p className="mt-2 px-3 py-3 text-sm text-red-900 bg-red-100 rounded-xl flex items-center gap-1.5">
        {props.message}
      </p>
    </div>
  );
};

export default ErrorLabel;
