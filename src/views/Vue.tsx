import { useMutation, useQuery } from "@tanstack/react-query";

import { useTemplate } from "@hooks/useTemplate";

const Vue = () => {
  const { queries, mutations } = useTemplate();

  // Parameters can be passed on queries.function(PARAMS)
  const q_getNotifications = useQuery(queries.getNotifications());

  // Parameters CANNOT be passed on mutations.function(), pass them on mutation.mutate(PARAMS)
  const m_oneParam = useMutation(mutations.oneParam());
  const m_fourParams = useMutation(mutations.fourParams());

  console.log(q_getNotifications.data); // (property) data: string | undefined

  return (
    <main>
      <h1>Exemple</h1>

      <button
        onClick={() => {
          m_oneParam.mutate();
          // (variables: void, options?: MutateOptions<string, Error, void, unknown> | undefined) => void
        }}
      >
        Mutate
      </button>

      <button
        onClick={() => {
          m_fourParams.mutate({ a: true, b: "test" });
          // (variables: { a: boolean; b: string; }, options?: MutateOptions<string, Error, { a: boolean; b: string; }, unknown> | undefined) => void
        }}
      >
        Mutate
      </button>
    </main>
  );
};

export default Vue;
