import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { getUsers } from '../api/user'

export const UserTable = () => {
  const {data} = useQuery({queryKey: ["users"], queryFn: getUsers})

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.map((user: any) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.age}</TableCell>
            <TableCell>{user.created_at}</TableCell>
            <TableCell>{user.updated_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}