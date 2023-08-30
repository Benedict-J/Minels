import { formatAmountCurrency } from "@/utils/format";

const getOrCreateLegendList = (chart: any, id: string) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer?.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'column';
    listContainer.style.margin = '0';
    listContainer.style.padding = '0';

    legendContainer?.appendChild(listContainer);
  }

  return listContainer;
}

export const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart: any, args: any, options: any) {
    const ul: any = getOrCreateLegendList(chart, options.containerID);

    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    const data = chart.data.datasets[0].data;

    items.forEach((item: any, index: number) => {
      const li = document.createElement('li');
      li.style.justifyContent = 'center';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = 'column';
      li.style.marginLeft = '10px';

      li.onclick = () => {
        const {type} = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
        }
        chart.update();
      };
      
      const subContainer = document.createElement('div');
      subContainer.style.display = 'flex';
      subContainer.style.alignItems = 'center';

      const boxSpan = document.createElement('div');
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + 'px';
      boxSpan.style.borderRadius = '30px';
      boxSpan.style.display = 'inline-block';
      boxSpan.style.flexShrink = '0';
      boxSpan.style.height = '20px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.width = '20px';

      const valueTextContainer = document.createElement('span');
      valueTextContainer.style.fontSize = '18px';
      valueTextContainer.style.fontWeight = '700';

      const valueText = document.createTextNode(formatAmountCurrency(parseInt(data[index])));
      valueTextContainer.appendChild(valueText);

      const textContainer = document.createElement('p');
      textContainer.style.color = item.fontColor;
      textContainer.style.margin = '0';
      textContainer.style.padding = '0';
      textContainer.style.fontSize = '14px';
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);
      
      subContainer.appendChild(boxSpan);
      subContainer.appendChild(valueTextContainer);

      li.appendChild(textContainer);
      li.appendChild(subContainer);
      ul.appendChild(li);
    })
  }
}