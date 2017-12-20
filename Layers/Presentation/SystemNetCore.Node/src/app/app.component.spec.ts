import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

let component: AppComponent;

describe('App', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent]
        });

        component = TestBed.createComponent(AppComponent).componentInstance;

    });

    it('should work', () => {

        expect(component instanceof AppComponent).toBe(true, 'should create AppComponent');
    });

});
