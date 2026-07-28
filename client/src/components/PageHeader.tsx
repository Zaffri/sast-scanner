import type { ReactElement } from 'react';

type props = {
  button?: ReactElement;
  title: string;
};

function PageHeader({ button, title }: props) {
  return (
    <div className="flex items-center justify-between w-full py-4">
      <h2 className="text-xl font-bold">{title}</h2>

      {button}
    </div>
  )
}

export default PageHeader
