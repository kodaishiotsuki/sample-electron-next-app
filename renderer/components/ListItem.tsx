import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { User } from "../interfaces";

type Props = {
  data: User;
};

const ListItem = ({ data }: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/detail/${data.id}`, undefined, { shallow: true });
  };
  return (
    <>
      <Link href="/detail/[id]" as={`/detail/${data.id}`}>
        {data.id}:{data.name}
      </Link>

      <p>
        <button onClick={handleClick}>test</button>
      </p>
    </>
  );
};

export default ListItem;
