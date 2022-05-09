import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
  url: environment.wsUrl,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
