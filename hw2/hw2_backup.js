
				//dy = -dy; 
				 //dy = -dy; 
				if (Math.abs(dx) > 1e-14) {
					t = Math.atan( dy / dx / dl ); 
				} else t = PIc2; 
				if (Math.abs(dy) < 1e-14) t = 0; 

				addPoint(path[j], PI23, t); 
				addPoint(path[j], PIc2, t); 
				addPoint(path[j+1], PI23, t); 

				addPoint(path[j], PIc2, t); 
				addPoint(path[j+1], PI23, t); 
				addPoint(path[j+1], PIc2, t); 