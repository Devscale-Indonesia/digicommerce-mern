import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/get-products';
import { IProduct } from '@/types/entity';

export const Home = () => {
  const { isPending, data } = useQuery<IProduct[]>({
    queryKey: ['catalogs'],
    queryFn: getProducts,
  });

  return (
    <main className="space-y-24">
      <section className="m-auto max-w-3xl text-center">
        <h1>{data?.length} curated design resources to speed up your creative workflow!</h1>
      </section>
      {isPending && <div>Loading</div>}
      {!isPending && data?.map((product) => <div key={product._id}>{product.name}</div>)}
    </main>
  );
};
