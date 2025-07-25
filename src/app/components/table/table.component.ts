import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { UserElement } from '../../common/interface/user';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { CommonModule } from '@angular/common';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-table',
  styleUrl: './table.component.scss',
  templateUrl: './table.component.html',
  imports: [MatTableModule, MatCheckboxModule, CommonModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnInit {
  userData: UserElement[] = [];

  displayedColumns: string[] = [
    'select',
    'Имя',
    'Фамилия',
    'E-mail',
    'Телефон',
  ];
  dataSource: UserElement[] = [];
  isLoading = true;

  constructor(
    public dataService: DataService,
    private dialog: MatDialog,
    public selectionService: SelectionService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dataService.userData$.subscribe({
      next: (users) => {
        this.dataSource = users || [];
        this.isLoading = false;
        console.log('Data loaded:', this.dataSource);
      },
      error: (err) => {
        console.error('Ошибка загрузки данных:', err);
        this.isLoading = false;
        this.dataSource = [];
      },
    });
  }

  onRowClick(user: UserElement): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { user },
    });

    dialogRef.afterClosed().subscribe((updatedUser) => {
      if (updatedUser) {
        console.log('User updated:', updatedUser);
      }
    });
  }

  isAllSelected() {
    return (
      this.selectionService.selection.selected.length === this.dataSource.length
    );
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selectionService.selection.clear();
      return;
    }
    this.selectionService.selection.select(...this.dataSource);
  }
}
