import LoadingSpinner from "../profile/loading-spinner";


export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    </div>
  )
}
