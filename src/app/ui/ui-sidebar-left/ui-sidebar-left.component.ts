import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: ['./ui-sidebar-left.component.scss']
})
export class UiSidebarLeftComponent implements OnInit {
  displayedColumns: string[] = ["name", "country"];
  public constructor() {
  }

  public ngOnInit(): void {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.siteDataSource.filter = filterValue.trim().toLowerCase();
  }
}
