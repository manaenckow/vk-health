import React, { Component } from 'react';
import { Group, Cell, Div, Spinner } from '@vkontakte/vkui';

class DistrictList extends Component {

    render() {

        const { districts } = this.props;

        const goDistrict = e => {
        const { setParentState, goPanel } = this.props;

        setParentState({
          district: e,
          cliniks: false
         });
        goPanel('district');
      }

        return (
            <Group className="transparentBody DistrictsList">
              <Group title="Выберите свой район">
                {
                    (districts && districts.length) ?
                        <>
                            {
                                districts.map((district, index) =>

                              <Cell expandable onClick={() => goDistrict(district)} district={district} key={index}>{district.name}</Cell>

                              )
                            }
                        </>
                        :
                        <Div><Spinner /></Div>
                }
            </Group>
            </Group>
        )
    }
}

export default DistrictList;
