import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ConnectionInfo = ({ soketiConfig, isConnected, lastUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Host:</span>
          <span className="font-mono">{soketiConfig.host}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Port:</span>
          <span className="font-mono">{soketiConfig.port}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">App ID:</span>
          <span className="font-mono">{soketiConfig.appId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status:</span>
          <span className={isConnected ? "text-green-600" : "text-red-600"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Terakhir Digunakan:</span>
          {lastUpdate ? (
            <div className="flex items-center  gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          ) : (
            <div className="flex items-center  gap-1 text-sm text-muted-foreground">
              Belum Digunakan Sejak {lastUpdate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionInfo;
