import AppRouter from './AppRouter';
import {MenuProvider} from "./MenuProvider";
function App() {
    return (
      <div>
      <MenuProvider>
              <AppRouter />
      </MenuProvider>
      </div>
    );
}
export default App;
