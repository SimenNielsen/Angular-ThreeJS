import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ThrusterService } from 'src/app/engine/utils/services/thruster.service';



@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: ['./ui-sidebar-left.component.scss']
})
export class UiSidebarLeftComponent implements OnInit {
  public constructor(public thrusterService: ThrusterService) {
    
  }

  public ngOnInit(): void {

  }
}
