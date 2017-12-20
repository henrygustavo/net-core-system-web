import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

let component: HomeComponent;

describe('Home', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [HomeComponent]

        });

        component = TestBed.createComponent(HomeComponent).componentInstance;

    });

    it('should work', () => {

        expect(component instanceof HomeComponent).toBe(true, 'should create HomeComponent');
    });
});
