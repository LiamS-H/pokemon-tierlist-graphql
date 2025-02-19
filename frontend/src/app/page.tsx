import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalTierlists } from "./_local-tierlists";
import { CreateTierlistButton } from "@/components/createTierlistButton";

export default function Home() {
    return (
        <div className="w-full flex justify-center pt-16">
            <div className="max-w-5xl">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-5xl">My Tierlists</CardTitle>
                        <CreateTierlistButton title="unnamed tierlist" />
                    </CardHeader>
                    <CardContent>
                        <LocalTierlists />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
