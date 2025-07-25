import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserElement } from '../common/interface/user';
import { ApiService } from './api.service';
import { SelectionService } from '../services/selection.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly localStorageKey = 'userData';
  private readonly apiUrl = 'https://test-data.directorix.cloud/task1';
  private userDataSubject = new BehaviorSubject<UserElement[]>([]);

  public userData$ = this.userDataSubject.asObservable();

  constructor(
    private apiService: ApiService,
    public selectionService: SelectionService
  ) {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    const localData = this.loadFromLocalStorage();

    if (localData && localData.length > 0) {
      this.userDataSubject.next(localData);
      return;
    }
    try {
      const apiData = await this.apiService.get<{ users: UserElement[] }>(
        this.apiUrl
      );
      const serverData = Array.isArray(apiData?.users) ? apiData.users : [];

      if (serverData.length > 0) {
        this.saveToLocalStorage(serverData);
        this.userDataSubject.next(serverData);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных с сервера:', error);
      if (localData.length === 0) {
        this.userDataSubject.next([]);
      }
    }
  }

  private loadFromLocalStorage(): UserElement[] {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка чтения из localStorage:', error);
      return [];
    }
  }

  private saveToLocalStorage(data: UserElement[]): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  }

  public addUser(user: UserElement): void {
    const currentData = this.userDataSubject.value;
    const newData = [...currentData, user];
    this.userDataSubject.next(newData);
    this.saveToLocalStorage(newData);
  }

  public updateUser(updatedUser: UserElement): void {
    const currentData = this.userDataSubject.value;
    const index = currentData.findIndex((u) => u.email === updatedUser.email);

    if (index !== -1) {
      const newData = [...currentData];
      newData[index] = updatedUser;
      this.userDataSubject.next(newData);
      this.saveToLocalStorage(newData);
    }
  }

  public deleteUsers(emails: string[]): void {
    const currentData = this.userDataSubject.value;
    const newData = currentData.filter((user) => !emails.includes(user.email));
    this.userDataSubject.next(newData);
    this.saveToLocalStorage(newData);

    if (newData.length === 0) {
      this.selectionService.clearSelection();
    }
  }

  public getCurrentData(): UserElement[] {
    return this.userDataSubject.value;
  }
}
