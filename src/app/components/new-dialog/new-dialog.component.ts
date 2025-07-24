import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  OnInit,
  Inject,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DataService } from '../../services/data.service';
import { UserElement } from '../../common/interface/user';

@Component({
  selector: 'app-new-dialog',
  templateUrl: './new-dialog.component.html',
  styleUrl: './new-dialog.component.scss',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NewDialogComponent implements OnInit {
  myForm: FormGroup;
  userData: UserElement[] = [];
  dialogTitle: string = 'Новый клиент';
  private localStorageKey = 'userData';

  constructor(
    public dialogRef: MatDialogRef<NewDialogComponent>,
    private fb: FormBuilder,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; user: UserElement }
  ) {
    if (data?.title) {
      this.dialogTitle = data.title;
    }
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^(\+7|8)[\d\- ]{10,15}$/)]],
    });
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const savedData = localStorage.getItem(this.localStorageKey);

    if (savedData) {
      try {
        this.userData = JSON.parse(savedData);

        if (!Array.isArray(this.userData)) {
          throw new Error('Данные в localStorage не являются массивом');
        }

        console.log('Успешно загружено из localStorage:', this.userData);
      } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error);
        this.clearAndReset();
      }
    } else {
      console.log('Локальные данные не найдены');
      this.userData = [];
    }
  }

  private clearAndReset(): void {
    localStorage.removeItem(this.localStorageKey);
    this.userData = [];
  }

  onSubmit() {
    if (this.myForm.valid) {
      const newUser: UserElement = {
        name: this.myForm.value.name,
        surname: this.myForm.value.surname,
        email: this.myForm.value.email,
        phone: this.myForm.value.phone || '',
      };
      this.dataService.addUser(newUser);
      this.dialogRef.close(newUser);
      this.myForm.reset();
    } else {
      console.log('Форма невалидна!');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.myForm.valid) {
      const updatedUser: UserElement = {
        ...this.data.user,
        ...this.myForm.value,
      };
      this.dialogRef.close(updatedUser);
    }
  }
}
