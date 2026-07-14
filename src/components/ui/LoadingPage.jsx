import { Container } from "./Container"
import { Spinner } from "./Spinner"

export function LoadingPage() {
    return (
        <Container>
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        </Container>
    )
}
