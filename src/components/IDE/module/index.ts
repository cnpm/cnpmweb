import { requireModule } from "@codeblitzjs/ide-core/bundle";
const CommpnDI = requireModule("@opensumi/di");
const CoreBrowser = requireModule("@opensumi/ide-core-browser");

const { Injectable} = CommpnDI;
const { Domain, BrowserModule, MenuId, MenuContribution} = CoreBrowser;

@Domain(MenuContribution)
class RegisterMenuContribution  {
  registerMenus(menus: any) {
    menus.unregisterMenuId(MenuId.SettingsIconMenu);
  }
}


@Injectable()
export class RegisterMenuModule extends BrowserModule {
  providers = [RegisterMenuContribution];
}