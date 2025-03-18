import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import { Row, Col, Input, Select } from 'antd';
import { StarFilled, SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMode } from "@/contexts/color-mode";
import { numShort, parseNumber, debounce } from '@/utils';

type ListRepoProps = {
  list?: any
}

export const ListRepo = ({ list }: ListRepoProps) => {
  const { mode } = useMode();
  const [filterValue, setFilterValue] = useState<string>('');
  const [filterLang, setFilterLang] = useState<any>();
  const [filterResult, setFilterResult] = useState<any>([]);
  const [loadingFilter, setLoadingFilter] = useState<boolean>(false);
  const listData = filterValue.length || filterLang ? filterResult : list;
  const parseLanguages = [...new Set(list.map((repo: any) => repo.language || "Unknown"))].toSorted();

  const debouncedFilter = useCallback(debounce((val: string) => {
    setFilterResult(
      list.filter((item: any) => 
        item.name.includes(val.toLowerCase())
        &&
        (!filterLang || item.language === (filterLang === 'Unknown' ? null : filterLang))
      )
    );

    setLoadingFilter(false); // End loading
  }, 500), []);

  const filterByRepo = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    setFilterValue(val);
    if(val){
      setLoadingFilter(true); // Start loading
      debouncedFilter(val);
      return;
    }
    // Reset filter result
    if(filterResult.length){
      setFilterResult(list);
    }
  }

  const filterByLanguage = (val: string | null) => {
    setFilterLang(val);
    setFilterResult(
      list.filter((item: any) => 
        (!val || item.language === (val === 'Unknown' ? null : val)) 
        &&
        item.name.includes(filterValue.toLowerCase())
      )
    );
  }

  return (
    <>
      {!!list.length && (
        <div className={(mode === 'dark' ? "bg-gray-800" : "bg-gray-50") + " sticky top-[109px] pt-2 px-1 -mx-1 -mt-2 z-10"}>
          <h6 className="mb-2 font-medium">Repositories ({list.length})</h6>
          <Row gutter={[16, 16]}>
            <Col lg={17} xs={24}>
              <Input
                allowClear
                placeholder="Search repository"
                suffix={loadingFilter ? <LoadingOutlined /> : <SearchOutlined />}
                value={filterValue}
                onChange={filterByRepo}
              />
            </Col>

            <Col lg={7} xs={24}>
              <Select
                allowClear
                showSearch
                className="w-full"
                placeholder="Language"
                title="Language"
                value={filterLang}
                onChange={filterByLanguage}
                options={parseLanguages.map((item: any) => ({ label: item, value: item }))}
              />
            </Col>
          </Row>

          <hr className="my-4 border-gray-300" />
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        {listData.length ?
          listData.map((repo: any) =>
            <div key={repo.id}>
              <a
                href={`https://github.com/${repo.owner.login}/${repo.name}/stargazers`}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                title={repo.stargazers_count ? parseNumber(repo.stargazers_count) + ' Stars' : ''}
                className={(mode === 'dark' ? "bg-gray-600! text-gray-200!" : "text-gray-600!") + " small float-right rounded-bl-2xl rounded-tr py-1 px-2 shadow"}
              >
                {repo.stargazers_count ? numShort(repo.stargazers_count) : 0}
                <StarFilled className="ml-1" />
              </a>

              <Link
                to={`/repo/${repo.name}/${repo.owner.login}`}
                className={(mode === 'dark' ? "text-gray-200! hover:bg-gray-700!" : "text-gray-600! hover:bg-blue-50!") + " border-gray-300 focus-within:border-blue-500 block p-3 shadow rounded border"}
              >
                <div className="text-lg font-medium break-words pr-2">{repo.name}</div>
                {repo.description}
              </Link>
            </div>
          )
          :
          !loadingFilter && (
            <h5 className="py-4 text-center">
              {list.length ? 'Not Found' : 'No repository'}
            </h5>
          )
        }
      </div>
    </>
  );
}
