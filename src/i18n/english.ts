import { enMachinery } from "./en-machinery";
import { enData } from "./en-data";
import { enUi } from "./en-ui";
import { enCatalog } from "./en-catalog";
import { enProduct } from "./en-product";
import { enContact } from "./en-contact";
import { enInfo } from "./en-info";
export default { ...enData, ...enUi, ...enCatalog, ...enProduct, ...enContact, ...enInfo, ...enMachinery };
