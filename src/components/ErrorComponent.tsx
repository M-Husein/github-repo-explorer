import { useEffect } from "react";
import { RefineErrorPageProps } from "@refinedev/ui-types";
import { Button, Result } from "antd";
import { useNavigation } from "@refinedev/core";

export const ErrorComponent: React.FC<RefineErrorPageProps> = () => {
  const { push } = useNavigation();

  useEffect(() => {
    document.getElementById('_splashScreen')?.classList.add('hidden');
  }, []);

  return (
    <Result
      status="404"
      title="404"
      extra={
        <div>
          <p>Sorry, the page you visited does not exist.</p>

          <Button
            type="primary"
            onClick={() => push("/")}
          >
            Back to Home
          </Button>
        </div>
      }
    />
  );
}
