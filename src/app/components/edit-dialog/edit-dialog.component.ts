import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserElement } from '../../common/interface/user';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EditDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    private fb: FormBuilder,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserElement }
  ) {
    this.editForm = this.fb.group({
      name: [data.user.name, [Validators.required, Validators.minLength(2)]],
      surname: [
        data.user.surname,
        [Validators.required, Validators.minLength(2)],
      ],
      email: [data.user.email, [Validators.required, Validators.email]],
      phone: [data.user.phone, [Validators.pattern(/^(\+7|8)[\d\- ]{10,15}$/)]],
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedUser: UserElement = {
        ...this.data.user,
        ...this.editForm.value,
      };
      this.dataService.updateUser(updatedUser);
      this.dialogRef.close(updatedUser);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
