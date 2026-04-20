import { LocationDetailView } from "@/features/location/components/location-detail-view"

interface LocationDetailPageProps {
  params: {
    id: string
  }
}

export default function LocationDetailPage({ params }: LocationDetailPageProps) {
  return <LocationDetailView id={params.id} />
}
