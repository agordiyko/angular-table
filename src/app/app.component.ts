import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { ApiService } from './services/api.service';
import { UserElement } from '../app/common/interface/user';
import { ApiResponse } from '../app/common/interface/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableComponent, ButtonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  mainTitle: string = 'Клиенты';
  userData: UserElement[] = [];

  private apiUrl = 'https://test-data.directorix.cloud/task1';
  private localStorageKey = 'userData';

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    await this.loadUserData();
  }
  private async loadUserData(): Promise<void> {
    const savedData = localStorage.getItem(this.localStorageKey);

    if (savedData) {
      this.userData = JSON.parse(savedData);
      console.log('Данные загружены из localStorage:', this.userData);
    } else {
      await this.fetchDataFromServer();
    }
  }
  private async fetchDataFromServer(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse>(this.apiUrl);
      this.userData = response.users;
      this.saveToLocalStorage();
      console.log('Данные получены с сервера:', this.userData);
    } catch (error) {
      console.error('Проблема с получением данных с сервера:', error);
      this.userData = [];
    }
  }
  private saveToLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.userData));
  }
  public clearLocalStorage(): void {
    localStorage.removeItem(this.localStorageKey);
    console.log('Хранилище localStorage очищено');
  }
  async refreshData(): Promise<void> {
    this.clearLocalStorage();
    await this.fetchDataFromServer();
  }
}
