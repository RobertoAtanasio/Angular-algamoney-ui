import { Component, OnInit } from '@angular/core';
import { DasboardService } from '../dasboard.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  charOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  // os detalhes dos parâmetros abaixo estão na documentação do chart.js e não no primeng
  // em tooltipItem tem a posição do valor a ser exibido bem como os valores que são passados ao gráfico
  // tais como o datasets (ver nos valores passados para o gráfico)
  options = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const valor = dataset.data[tooltipItem.index];
          const label = dataset.label ? (dataset.label + ': ') : '';

          return label + this.decimalPipe.transform(valor, '1.2-2');
        }
      }
    }
  };

  pieChartData: any;
  lineChartData: any;

  // pieChartData = {
  //   labels: ['Mensal', 'Educação', 'Lazer', 'Imprevistos'],
  //   datasets: [
  //     {
  //       data: [2500, 2700, 550, 235],
  //       backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC']
  //     }
  //   ]
  // };

  // lineChartData = {
  //   labels: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  //   datasets: [
  //     {
  //       label: 'Receitas',
  //       data: [4, 10, 18, 5, 1, 20, 3],
  //       borderColor: '#3366CC'
  //     }, {
  //       label: 'Despesas',
  //       data: [10, 15, 8, 5, 1, 7, 9],
  //       borderColor: '#D62B00'
  //     }, {
  //       label: 'Outros',
  //       data: [5, 5, 9, 3, 7, 2, 7],
  //       borderColor: '#109618'
  //     }
  //   ]
  // };

  constructor(
    private dashboardService: DasboardService,
    private errorHandler: ErrorHandlerService,
    private decimalPipe: DecimalPipe
  ) {
    this.configurarGraficoPizza();
    this.configurarGraficoLinha();
  }

  ngOnInit() {
  }

  configurarGraficoPizza() {
    this.dashboardService.lancamentosPorCategoria()
      .then(dados => {
        this.pieChartData = {
          labels: dados.map(dado => dado.categoria.nome),
          datasets: [
            {
              data: dados.map(dado => dado.total),
              backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
                                  '#DD4477', '#3366CC', '#DC3912']
            }
          ]
        };
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });

    // Exemplo do retorno do JSON:
    // [
    //     {
    //         "categoria": {
    //             "codigo": 2,
    //             "nome": "Alimentação"
    //         },
    //         "total": 100.32
    //     },
    //     {
    //         "categoria": {
    //             "codigo": 4,
    //             "nome": "Farmácia"
    //         },
    //         "total": 2450.96
    //     }
    // ]
  }

  configurarGraficoLinha() {
    this.dashboardService.lancamentosPorDia()
      .then(dados => {

        // console.log('RECEITA',  dados.filter(dado => dado.tipo === 'RECEITA'));
        // console.log('DESPESA',  dados.filter(dado => dado.tipo === 'DESPESA'));

        const diasDoMes = this.configurarDiasMes();
        const totaisReceitas = this.totaisPorCadaDiaMes(
          dados.filter(dado => dado.tipo === 'RECEITA'), diasDoMes);
        const totaisDespesas = this.totaisPorCadaDiaMes(
          dados.filter(dado => dado.tipo === 'DESPESA'), diasDoMes);

        this.lineChartData = {
          labels: diasDoMes,
          datasets: [
            {
              label: 'Receitas',
              data: totaisReceitas,
              borderColor: '#3366CC'
            }, {
              label: 'Despesas',
              data: totaisDespesas,
              borderColor: '#D62B00'
            }
          ]
        };
      });

    // Exemplo do retorno do JSON:
    // [
    //     {
    //         "tipo": "RECEITA",
    //         "dia": "2019-05-01",
    //         "total": 6500
    //     },
    //     {
    //         "tipo": "DESPESA",
    //         "dia": "2019-05-13",
    //         "total": 1010.32
    //     },
    //     {
    //         "tipo": "RECEITA",
    //         "dia": "2019-05-21",
    //         "total": 500
    //     },
    //     {
    //         "tipo": "DESPESA",
    //         "dia": "2019-05-06",
    //         "total": 400.32
    //     }
    // ]
  }

  private configurarDiasMes() {
    const mesReferencia = new Date();
    mesReferencia.setMonth(mesReferencia.getMonth() + 1);
    mesReferencia.setDate(0);                     // vai para o último dia do mês anterior
    const quantidade = mesReferencia.getDate();   // pega o dia da data

    const dias: number[] = [];

    for (let i = 1; i <= quantidade; i++) {
      dias.push(i);
    }

    return dias;
  }

  private totaisPorCadaDiaMes(dados, diasDoMes) {
    const totais: number[] = [];
    for (const dia of diasDoMes) {
      let total = 0;
      for (const dado of dados) {
        if (dado.dia.getDate() === dia) {
          total = dado.total;
          break;
        }
      }
      totais.push(total);
    }

    return totais;
  }

}
