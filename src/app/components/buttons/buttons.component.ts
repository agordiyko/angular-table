import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { NewDialogComponent } from '../new-dialog/new-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-buttons',
  imports: [ButtonComponent, MatButtonModule, MatDialogModule],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
  standalone: true,
})
export class ButtonsComponent {
  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private selectionService: SelectionService
  ) {}

  openDialog() {
    this.dialog.open(NewDialogComponent, {
      data: { title: 'Новый клиент' },
    });
  }
  deleteDialog() {
    if (this.selectionService.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: { count: this.selectionService.selection.selected.length },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          const emailsToDelete = this.selectionService.selection.selected.map(
            (user) => user.email
          );
          this.dataService.deleteUsers(emailsToDelete);
          this.selectionService.selection.clear();
        }
      });
    }
  }
}
